import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  Table,
  Text,
} from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';
import type { Archer, Session } from '../types';
import { getSession, updateSession, deleteSession } from '../lib/storage';
import { ROUNDS } from '../data/rounds';
import {
  calculateTotalScore,
  calculateHits,
  calculateGolds,
  getAllowance,
  calculateHandicappedScore,
} from '../lib/scoring';
import { AddArcherModal } from '../components/AddArcherModal';
import { ScoreModal } from '../components/ScoreModal';

export function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [scoringArcher, setScoringArcher] = useState<Archer | null>(null);

  useEffect(() => {
    if (id) setSession(getSession(id));
  }, [id]);

  const round = session ? ROUNDS[session.roundId] : null;

  function handleAddArcher(archer: Archer) {
    if (!session) return;
    const updated = { ...session, archers: [...session.archers, archer] };
    setSession(updated);
    updateSession(updated);
    setShowAddModal(false);
  }

  function handleDelete() {
    if (!session) return;
    deleteSession(session.id);
    void navigate('/');
  }

  function handleDateChange(date: string) {
    if (!session) return;
    const updated = { ...session, date };
    setSession(updated);
    updateSession(updated);
  }

  function handleScoreChange(archerId: string, scores: (number | null)[]) {
    if (!session) return;
    const updated = {
      ...session,
      archers: session.archers.map(a =>
        a.id === archerId ? { ...a, scores } : a,
      ),
    };
    setSession(updated);
    updateSession(updated);
    setScoringArcher(prev => (prev?.id === archerId ? { ...prev, scores } : prev));
  }

  if (!session || !round) {
    return (
      <Container maxW="4xl" py={8}>
        <Text>Session not found.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <Flex justify="space-between" align="flex-start" mb={6}>
        <Box>
          <Heading size="2xl">{session.clubName}</Heading>
          <Flex align="center" gap={2} mt={1}>
            <Text color="gray.500">{round.name} ·</Text>
            <Input
              type="date"
              size="sm"
              w="auto"
              variant="flushed"
              value={session.date}
              onChange={e => handleDateChange(e.target.value)}
            />
          </Flex>
        </Box>
        <Flex gap={2}>
          <IconButton
            variant="outline"
            colorPalette="red"
            aria-label="Delete session"
            onClick={handleDelete}
          >
            <Trash2 />
          </IconButton>
          <Button colorPalette="blue" onClick={() => setShowAddModal(true)}>
            Add Archer
          </Button>
        </Flex>
      </Flex>

      {session.archers.length === 0 ? (
        <Box textAlign="center" py={12} color="gray.500">
          <Text>No archers yet. Add one to get started.</Text>
        </Box>
      ) : (
        <Box overflowX="auto">
          <Table.Root variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Total</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Hits</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Golds</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">HC</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Allow.</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">HC Score</Table.ColumnHeader>
                <Table.ColumnHeader />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {session.archers.map(archer => {
                const totalScore = calculateTotalScore(archer.scores);
                const hits = calculateHits(archer.scores);
                const golds = calculateGolds(archer.scores, round.goldScore);
                const allowance = getAllowance(archer.handicap, round.allowances);
                const hcScore = calculateHandicappedScore(totalScore, allowance);

                return (
                  <Table.Row key={archer.id}>
                    <Table.Cell fontWeight="medium">{archer.name}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette={archer.bowType === 'Recurve' ? 'blue' : 'green'}
                      >
                        {archer.bowType}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">{totalScore}</Table.Cell>
                    <Table.Cell textAlign="right">{hits}</Table.Cell>
                    <Table.Cell textAlign="right">{golds}</Table.Cell>
                    <Table.Cell textAlign="right">
                      {archer.handicap !== null ? archer.handicap : '—'}
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      {archer.handicap !== null ? allowance : '—'}
                    </Table.Cell>
                    <Table.Cell textAlign="right" fontWeight="semibold">
                      {hcScore}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setScoringArcher(archer)}
                      >
                        Scores
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      <AddArcherModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddArcher}
        round={round}
      />

      <ScoreModal
        archer={scoringArcher}
        round={round}
        onClose={() => setScoringArcher(null)}
        onChange={handleScoreChange}
      />
    </Container>
  );
}

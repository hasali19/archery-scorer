import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  Card,
  Container,
  Field,
  Flex,
  Heading,
  IconButton,
  Input,
  NativeSelect,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Archer, BowType, Session } from '../types';
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

  function updateArchers(archers: Archer[]) {
    if (!session) return;
    const updated = { ...session, archers };
    setSession(updated);
    updateSession(updated);
  }

  function handleAddArcher(archer: Archer) {
    if (!session) return;
    updateArchers([...session.archers, archer]);
    setShowAddModal(false);
  }

  function handleArcherChange(archerId: string, changes: Partial<Pick<Archer, 'name' | 'bowType' | 'handicap'>>) {
    if (!session) return;
    updateArchers(session.archers.map(a => (a.id === archerId ? { ...a, ...changes } : a)));
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
    updateArchers(session.archers.map(a => (a.id === archerId ? { ...a, scores } : a)));
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
      <Flex justify="space-between" align="flex-start" mb={8}>
        <Box>
          <Heading size="2xl">{round.name}</Heading>
          <Input
            type="date"
            size="sm"
            w="auto"
            variant="flushed"
            value={session.date}
            onChange={e => handleDateChange(e.target.value)}
            mt={1}
          />
        </Box>
        <IconButton
          variant="outline"
          colorPalette="red"
          aria-label="Delete session"
          onClick={handleDelete}
        >
          <Trash2 />
        </IconButton>
      </Flex>

      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="xl">{session.clubName}</Heading>
        <Button colorPalette="blue" onClick={() => setShowAddModal(true)}>
          Add Archer
        </Button>
      </Flex>

      {session.archers.length === 0 ? (
        <Box textAlign="center" py={12} color="gray.500">
          <Text>No archers yet. Add one to get started.</Text>
        </Box>
      ) : (
        <>
          {/* Mobile card layout */}
          <Stack gap={3} display={{ base: 'flex', md: 'none' }}>
            {session.archers.map(archer => {
              const totalScore = calculateTotalScore(archer.scores);
              const hits = calculateHits(archer.scores);
              const golds = calculateGolds(archer.scores, round.goldScore);
              const allowance = getAllowance(archer.handicap, round.allowances);
              const hcScore = calculateHandicappedScore(totalScore, allowance);

              return (
                <Card.Root key={archer.id} variant="outline">
                  <Card.Body p={4}>
                    <Stack gap={3} mb={3}>
                      <Field.Root>
                        <Field.Label>Name</Field.Label>
                        <Input
                          size="sm"
                          value={archer.name}
                          onChange={e =>
                            handleArcherChange(archer.id, { name: e.target.value })
                          }
                        />
                      </Field.Root>
                      <Flex gap={4}>
                        <Field.Root flex={1}>
                          <Field.Label>Bow Type</Field.Label>
                          <NativeSelect.Root size="sm">
                            <NativeSelect.Field
                              value={archer.bowType}
                              onChange={e =>
                                handleArcherChange(archer.id, {
                                  bowType: e.target.value as BowType,
                                })
                              }
                            >
                              <option value="Recurve">Recurve</option>
                              <option value="Barebow">Barebow</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                          </NativeSelect.Root>
                        </Field.Root>
                        <Field.Root w="80px">
                          <Field.Label>Handicap</Field.Label>
                          <Input
                            size="sm"
                            type="number"
                            min={0}
                            max={150}
                            value={archer.handicap ?? ''}
                            onChange={e =>
                              handleArcherChange(archer.id, {
                                handicap: e.target.value !== '' ? Number(e.target.value) : null,
                              })
                            }
                            placeholder="None"
                          />
                        </Field.Root>
                      </Flex>
                    </Stack>
                    <SimpleGrid columns={3} gap={3} mb={3}>
                      {[
                        { label: 'Total', value: totalScore },
                        { label: 'Hits', value: hits },
                        { label: 'Golds', value: golds },
                        { label: 'Allowance', value: archer.handicap !== null ? allowance : '—' },
                        { label: 'Handicap Total', value: hcScore },
                      ].map(({ label, value }) => (
                        <Box key={label}>
                          <Text fontSize="xs" color="gray.500">{label}</Text>
                          <Text fontWeight="medium">{value}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                    <Flex justify="flex-end">
                      <Button size="sm" variant="outline" onClick={() => setScoringArcher(archer)}>
                        <Pencil /> Scores
                      </Button>
                    </Flex>
                  </Card.Body>
                </Card.Root>
              );
            })}
          </Stack>

          {/* Desktop table layout */}
          <Box overflowX="auto" display={{ base: 'none', md: 'block' }}>
            <Table.Root variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Type</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Handicap</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Total</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Hits</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Golds</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Allowance</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Handicap Score</Table.ColumnHeader>
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
                      <Table.Cell>
                        <Input
                          size="sm"
                          value={archer.name}
                          onChange={e =>
                            handleArcherChange(archer.id, { name: e.target.value })
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <NativeSelect.Root size="sm">
                          <NativeSelect.Field
                            value={archer.bowType}
                            onChange={e =>
                              handleArcherChange(archer.id, {
                                bowType: e.target.value as BowType,
                              })
                            }
                          >
                            <option value="Recurve">Recurve</option>
                            <option value="Barebow">Barebow</option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          size="sm"
                          type="number"
                          min={0}
                          max={150}
                          value={archer.handicap ?? ''}
                          onChange={e =>
                            handleArcherChange(archer.id, {
                              handicap: e.target.value !== '' ? Number(e.target.value) : null,
                            })
                          }
                          placeholder="—"
                          textAlign="right"
                        />
                      </Table.Cell>
                      <Table.Cell textAlign="right" fontWeight="semibold">{totalScore}</Table.Cell>
                      <Table.Cell textAlign="right">{hits}</Table.Cell>
                      <Table.Cell textAlign="right">{golds}</Table.Cell>
                      <Table.Cell textAlign="right">
                        {archer.handicap !== null ? allowance : '—'}
                      </Table.Cell>
                      <Table.Cell textAlign="right" fontWeight="semibold">
                        {hcScore}
                      </Table.Cell>
                      <Table.Cell>
                        <Button size="sm" variant="outline" onClick={() => setScoringArcher(archer)}>
                          <Pencil /> Scores
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Box>
        </>
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

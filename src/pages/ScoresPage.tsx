import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import type { Archer } from '../types';
import { getSession, updateSession } from '../lib/storage';
import { ROUNDS } from '../data/rounds';
import { ScoreGrid } from '../components/ScoreGrid';

export function ScoresPage() {
  const { id, archerId } = useParams<{ id: string; archerId: string }>();
  const [archer, setArcher] = useState<Archer | null>(null);
  const [sessionRoundId, setSessionRoundId] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !archerId) return;
    const session = getSession(id);
    if (!session) return;
    setSessionRoundId(session.roundId);
    const found = session.archers.find(a => a.id === archerId) ?? null;
    setArcher(found);
  }, [id, archerId]);

  const round = sessionRoundId ? ROUNDS[sessionRoundId] : null;

  function handleChange(scores: (number | null)[]) {
    if (!archer || !id) return;
    const session = getSession(id);
    if (!session) return;
    const updatedArcher = { ...archer, scores };
    const updated = {
      ...session,
      archers: session.archers.map(a => (a.id === archer.id ? updatedArcher : a)),
    };
    updateSession(updated);
    setArcher(updatedArcher);
  }

  if (!archer || !round) {
    return (
      <Container maxW="4xl" py={8}>
        <Text>Archer not found.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <Heading size="xl" mb={1}>{archer.name}</Heading>
      <Text color="gray.500" mb={6}>{round.name}</Text>
      <Box>
        <ScoreGrid round={round} scores={archer.scores} onChange={handleChange} />
      </Box>
    </Container>
  );
}

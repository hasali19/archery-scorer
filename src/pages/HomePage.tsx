import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';
import type { Session } from '../types';
import { getSessions, deleteSession } from '../lib/storage';
import { ROUNDS } from '../data/rounds';
import { NewSessionModal } from '../components/NewSessionModal';

export function HomePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  }

  function handleCreated(session: Session) {
    setSessions(prev => [...prev, session]);
    setShowNewModal(false);
    void navigate(`/session/${session.id}`);
  }

  return (
    <Container maxW="4xl" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="2xl">Archery Scorer</Heading>
        {sessions.length > 0 && (
          <Button colorPalette="blue" onClick={() => setShowNewModal(true)}>
            New Session
          </Button>
        )}
      </Flex>

      {sessions.length === 0 ? (
        <Box textAlign="center" py={16}>
          <Text fontSize="lg" color="gray.500" mb={4}>
            Create a new session to start.
          </Text>
          <Button colorPalette="blue" onClick={() => setShowNewModal(true)}>
            New Session
          </Button>
        </Box>
      ) : (
        <Stack gap={3}>
          {sessions.map(session => {
            const round = ROUNDS[session.roundId];
            return (
              <Card.Root
                key={session.id}
                variant="outline"
                cursor="pointer"
                _hover={{ bg: 'gray.50', _dark: { bg: 'gray.800' } }}
                onClick={() => void navigate(`/session/${session.id}`)}
              >
                <Card.Body py={4} px={5}>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="semibold" fontSize="lg">
                        {session.clubName}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {round?.name ?? session.roundId} · {session.date}
                      </Text>
                    </Box>
                    <Flex align="center" gap={2}>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        colorPalette="red"
                        aria-label="Delete session"
                        onClick={e => handleDelete(e, session.id)}
                      >
                        <Trash2 />
                      </IconButton>
                    </Flex>
                  </Flex>
                </Card.Body>
              </Card.Root>
            );
          })}
        </Stack>
      )}

      <NewSessionModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreated={handleCreated}
      />
    </Container>
  );
}

import { Box, Heading, Input, Stack, Table } from '@chakra-ui/react';
import type { RoundDefinition } from '../types';
import { calculateTotalScore } from '../lib/scoring';

interface Props {
  round: RoundDefinition;
  scores: (number | null)[];
  onChange: (scores: (number | null)[]) => void;
}

function displayScore(s: number | null): string {
  if (s === null) return '';
  if (s === 0) return 'M';
  return String(s);
}

export function ScoreGrid({ round, scores, onChange }: Props) {
  function handleChange(idx: number, raw: string) {
    const val = raw.trim().toUpperCase();
    const updated = [...scores];
    if (val === '') {
      updated[idx] = null;
    } else if (val === 'M') {
      updated[idx] = 0;
    } else {
      const n = parseInt(val, 10);
      if (!isNaN(n) && n >= 0 && n <= round.maxArrowScore) {
        updated[idx] = n;
      }
    }
    onChange(updated);
  }

  let offset = 0;
  return (
    <Stack gap={6}>
      {round.distances.map((dist, di) => {
        const distStart = offset;
        offset += dist.endCount * dist.arrowsPerEnd;

        return (
          <Box key={di}>
            <Heading size="md" mb={3}>{dist.distanceMeters}m</Heading>
            <Box overflowX="auto">
              <Table.Root size="sm" variant="outline">
                <Table.Body>
                  {Array.from({ length: dist.endCount }, (_, ei) => {
                    const endStart = distStart + ei * dist.arrowsPerEnd;
                    const endScores = scores.slice(endStart, endStart + dist.arrowsPerEnd);
                    const endTotal = calculateTotalScore(endScores);
                    return (
                      <Table.Row key={ei}>
                        <Table.Cell>{ei + 1}</Table.Cell>
                        {Array.from({ length: dist.arrowsPerEnd }, (_, ai) => {
                          const idx = endStart + ai;
                          return (
                            <Table.Cell key={ai} p={1}>
                              <Input
                                size="xs"
                                textAlign="center"
                                w="36px"
                                value={displayScore(scores[idx])}
                                onChange={e => handleChange(idx, e.target.value)}
                                onFocus={e => e.target.select()}
                              />
                            </Table.Cell>
                          );
                        })}
                        <Table.Cell textAlign="right" fontWeight="medium">
                          {endTotal}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}

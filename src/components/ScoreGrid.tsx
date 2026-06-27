import { Box, Flex, Heading, Input, Stack, Table, Text } from '@chakra-ui/react';
import type { RoundDefinition } from '../types';
import { calculateTotalScore, calculateHits, calculateGolds } from '../lib/scoring';

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

  const sections = round.distances.map((dist, di) => {
    const distStart = offset;
    offset += dist.endCount * dist.arrowsPerEnd;

    let distCumulative = 0;
    const endRows = Array.from({ length: dist.endCount }, (_, ei) => {
      const endStart = distStart + ei * dist.arrowsPerEnd;
      const endScores = scores.slice(endStart, endStart + dist.arrowsPerEnd);
      const endTotal = calculateTotalScore(endScores);
      const endHits = calculateHits(endScores);
      const endGolds = calculateGolds(endScores, round.goldScore);
      distCumulative += endTotal;
      return { ei, endStart, endTotal, endHits, endGolds, runningTotal: distCumulative };
    });

    const distScores = scores.slice(distStart, distStart + dist.endCount * dist.arrowsPerEnd);
    const distTotal = calculateTotalScore(distScores);
    const distHits = calculateHits(distScores);
    const distGolds = calculateGolds(distScores, round.goldScore);
    const distRunningTotal = endRows.length > 0 ? endRows[endRows.length - 1].runningTotal : 0;

    return { dist, di, distTotal, distHits, distGolds, distRunningTotal, endRows };
  });

  const grandTotal = calculateTotalScore(scores);
  const grandHits = calculateHits(scores);
  const grandGolds = calculateGolds(scores, round.goldScore);

  return (
    <Stack gap={6}>
      <Box>
        <Flex gap={6}>
          {[
            { label: 'Total', value: grandTotal },
            { label: 'Hits', value: grandHits },
            { label: 'Golds', value: grandGolds },
          ].map(({ label, value }) => (
            <Box key={label}>
              <Text fontSize="sm" color="gray.500">{label}</Text>
              <Text fontSize="xl" fontWeight="semibold">{value}</Text>
            </Box>
          ))}
        </Flex>
      </Box>

      {sections.map(({ dist, di, distTotal, distHits, distGolds, distRunningTotal, endRows }) => (
        <Box key={di}>
          <Heading size="md" mb={3}>{dist.distanceMeters}m</Heading>
          <Box overflowX="auto">
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader />
                  {Array.from({ length: dist.arrowsPerEnd }, (_, i) => (
                    <Table.ColumnHeader key={i} />
                  ))}
                  <Table.ColumnHeader textAlign="center">End</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Hits</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Golds</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">RT</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {endRows.map(({ ei, endStart, endTotal, endHits, endGolds, runningTotal }) => (
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
                    <Table.Cell textAlign="center" fontWeight="medium">{endTotal}</Table.Cell>
                    <Table.Cell textAlign="center">{endHits}</Table.Cell>
                    <Table.Cell textAlign="center">{endGolds}</Table.Cell>
                    <Table.Cell textAlign="center" fontWeight="medium">{runningTotal}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <Table.Row fontWeight="semibold">
                  <Table.Cell>Total</Table.Cell>
                  {Array.from({ length: dist.arrowsPerEnd }, (_, i) => (
                    <Table.Cell key={i} />
                  ))}
                  <Table.Cell textAlign="center">{distTotal}</Table.Cell>
                  <Table.Cell textAlign="center">{distHits}</Table.Cell>
                  <Table.Cell textAlign="center">{distGolds}</Table.Cell>
                  <Table.Cell textAlign="center">{distRunningTotal}</Table.Cell>
                </Table.Row>
              </Table.Footer>
            </Table.Root>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

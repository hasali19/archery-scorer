import { Box, Input, Table, Text } from '@chakra-ui/react';
import type { RoundDefinition } from '../types';
import { calculateTotalScore } from '../lib/scoring';

interface Props {
  round: RoundDefinition;
  scores: (number | null)[];
  onChange: (scores: (number | null)[]) => void;
}

interface RowData {
  distanceIdx: number;
  endIdx: number;
  startArrowIdx: number;
  isFirstInDistance: boolean;
  distanceEndCount: number;
}

function buildRows(round: RoundDefinition): RowData[] {
  const rows: RowData[] = [];
  let offset = 0;
  round.distances.forEach((dist, di) => {
    for (let ei = 0; ei < dist.endCount; ei++) {
      rows.push({
        distanceIdx: di,
        endIdx: ei,
        startArrowIdx: offset,
        isFirstInDistance: ei === 0,
        distanceEndCount: dist.endCount,
      });
      offset += dist.arrowsPerEnd;
    }
  });
  return rows;
}

function displayScore(s: number | null): string {
  if (s === null) return '';
  if (s === 0) return 'M';
  return String(s);
}

export function ScoreGrid({ round, scores, onChange }: Props) {
  const rows = buildRows(round);
  const maxArrowsPerEnd = Math.max(...round.distances.map(d => d.arrowsPerEnd));

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

  return (
    <Box overflowX="auto">
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Dist.</Table.ColumnHeader>
            <Table.ColumnHeader>End</Table.ColumnHeader>
            {Array.from({ length: maxArrowsPerEnd }, (_, i) => (
              <Table.ColumnHeader key={i} textAlign="center">
                A{i + 1}
              </Table.ColumnHeader>
            ))}
            <Table.ColumnHeader textAlign="right">End Total</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map(row => {
            const dist = round.distances[row.distanceIdx];
            const endScores = scores.slice(
              row.startArrowIdx,
              row.startArrowIdx + dist.arrowsPerEnd,
            );
            const endTotal = calculateTotalScore(endScores);
            return (
              <Table.Row key={`${row.distanceIdx}-${row.endIdx}`}>
                {row.isFirstInDistance && (
                  <Table.Cell rowSpan={row.distanceEndCount} verticalAlign="middle">
                    <Text fontWeight="semibold" fontSize="sm">
                      {dist.distanceMeters}m
                    </Text>
                  </Table.Cell>
                )}
                <Table.Cell>{row.endIdx + 1}</Table.Cell>
                {Array.from({ length: dist.arrowsPerEnd }, (_, ai) => {
                  const idx = row.startArrowIdx + ai;
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
  );
}

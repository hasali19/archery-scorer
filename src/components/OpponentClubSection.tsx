import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  IconButton,
  Input,
  NativeSelect,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';
import type { BowType, OpponentArcher, OpponentClub, RoundDefinition } from '../types';
import { getAllowance, calculateHandicappedScore } from '../lib/scoring';

interface Props {
  club: OpponentClub;
  round: RoundDefinition;
  onClubNameChange: (name: string) => void;
  onAddArcher: () => void;
  onArcherChange: (archerId: string, changes: Partial<Pick<OpponentArcher, 'name' | 'bowType' | 'handicap' | 'totalScore'>>) => void;
  onDeleteArcher: (archerId: string) => void;
  onDeleteClub: () => void;
}

export function OpponentClubSection({
  club,
  round,
  onClubNameChange,
  onAddArcher,
  onArcherChange,
  onDeleteArcher,
  onDeleteClub,
}: Props) {
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Flex align="center" gap={2} flex={1} mr={4}>
          <Input
            value={club.clubName}
            onChange={e => onClubNameChange(e.target.value)}
            placeholder="Club name"
            variant="flushed"
            fontSize="xl"
            fontWeight="bold"
          />
        </Flex>
        <Flex gap={2}>
          <Button colorPalette="blue" onClick={onAddArcher}>Add Archer</Button>
          <IconButton variant="outline" colorPalette="red" aria-label="Delete opponent" onClick={onDeleteClub}>
            <Trash2 />
          </IconButton>
        </Flex>
      </Flex>

      {club.archers.length === 0 ? (
        <Box textAlign="center" py={8} color="gray.500">
          <Text>No archers yet. Add one to get started.</Text>
        </Box>
      ) : (
        <>
          {/* Mobile card layout */}
          <Stack gap={3} display={{ base: 'flex', md: 'none' }}>
            {club.archers.map(archer => {
              const allowance = getAllowance(archer.handicap, round.allowances);
              const hcScore = calculateHandicappedScore(archer.totalScore, allowance);
              return (
                <Card.Root key={archer.id} variant="outline">
                  <Card.Body p={4}>
                    <Stack gap={3} mb={3}>
                      <Field.Root>
                        <Field.Label>Name</Field.Label>
                        <Input
                          size="sm"
                          value={archer.name}
                          onChange={e => onArcherChange(archer.id, { name: e.target.value })}
                        />
                      </Field.Root>
                      <Flex gap={4}>
                        <Field.Root flex={1}>
                          <Field.Label>Bow Type</Field.Label>
                          <NativeSelect.Root size="sm">
                            <NativeSelect.Field
                              value={archer.bowType}
                              onChange={e => onArcherChange(archer.id, { bowType: e.target.value as BowType })}
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
                            onChange={e => onArcherChange(archer.id, {
                              handicap: e.target.value !== '' ? Number(e.target.value) : null,
                            })}
                            placeholder="None"
                          />
                        </Field.Root>
                      </Flex>
                      <Field.Root>
                        <Field.Label>Score</Field.Label>
                        <Input
                          size="sm"
                          type="number"
                          min={0}
                          value={archer.totalScore}
                          onChange={e => onArcherChange(archer.id, {
                            totalScore: e.target.value !== '' ? Number(e.target.value) : 0,
                          })}
                        />
                      </Field.Root>
                    </Stack>
                    <SimpleGrid columns={2} gap={3} mb={3}>
                      {[
                        { label: 'Allowance', value: archer.handicap !== null ? allowance : '—' },
                        { label: 'Handicap Total', value: archer.handicap !== null ? hcScore : '—' },
                      ].map(({ label, value }) => (
                        <Box key={label}>
                          <Text fontSize="xs" color="gray.500">{label}</Text>
                          <Text fontWeight="medium">{value}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                    <Flex justify="flex-end">
                      <IconButton size="sm" variant="ghost" colorPalette="red" aria-label="Delete archer" onClick={() => onDeleteArcher(archer.id)}>
                        <Trash2 />
                      </IconButton>
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
                  <Table.ColumnHeader textAlign="right">Score</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Allowance</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Handicap Score</Table.ColumnHeader>
                  <Table.ColumnHeader />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {club.archers.map(archer => {
                  const allowance = getAllowance(archer.handicap, round.allowances);
                  const hcScore = calculateHandicappedScore(archer.totalScore, allowance);
                  return (
                    <Table.Row key={archer.id}>
                      <Table.Cell>
                        <Input
                          size="sm"
                          value={archer.name}
                          onChange={e => onArcherChange(archer.id, { name: e.target.value })}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <NativeSelect.Root size="sm">
                          <NativeSelect.Field
                            value={archer.bowType}
                            onChange={e => onArcherChange(archer.id, { bowType: e.target.value as BowType })}
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
                          onChange={e => onArcherChange(archer.id, {
                            handicap: e.target.value !== '' ? Number(e.target.value) : null,
                          })}
                          placeholder="—"
                          textAlign="right"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          size="sm"
                          type="number"
                          min={0}
                          value={archer.totalScore}
                          onChange={e => onArcherChange(archer.id, {
                            totalScore: e.target.value !== '' ? Number(e.target.value) : 0,
                          })}
                          textAlign="right"
                        />
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        {archer.handicap !== null ? allowance : '—'}
                      </Table.Cell>
                      <Table.Cell textAlign="right" fontWeight="semibold">
                        {archer.handicap !== null ? hcScore : '—'}
                      </Table.Cell>
                      <Table.Cell>
                        <Flex justify="flex-end">
                          <IconButton size="sm" variant="ghost" colorPalette="red" aria-label="Delete archer" onClick={() => onDeleteArcher(archer.id)}>
                            <Trash2 />
                          </IconButton>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Box>
        </>
      )}
    </Box>
  );
}

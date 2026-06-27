import { useState } from 'react';
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Stack,
} from '@chakra-ui/react';
import type { Archer, BowType, RoundDefinition } from '../types';
import { totalArrows } from '../lib/scoring';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (archer: Archer) => void;
  round: RoundDefinition;
}

export function AddArcherModal({ open, onClose, onAdd, round }: Props) {
  const [name, setName] = useState('');
  const [bowType, setBowType] = useState<BowType>('Recurve');
  const [handicapStr, setHandicapStr] = useState('');

  function handleAdd() {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const handicap = handicapStr !== '' ? Number(handicapStr) : null;
    onAdd({
      id: crypto.randomUUID(),
      name: trimmedName,
      bowType,
      handicap,
      scores: Array<number | null>(totalArrows(round)).fill(null),
    });
    setName('');
    setBowType('Recurve');
    setHandicapStr('');
  }

  return (
    <Dialog.Root open={open} onOpenChange={e => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Add Archer</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={4}>
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Archer name"
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Bow Type</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={bowType}
                    onChange={e => setBowType(e.target.value as BowType)}
                  >
                    <option value="Recurve">Recurve</option>
                    <option value="Barebow">Barebow</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
              <Field.Root>
                <Field.Label>Handicap</Field.Label>
                <Input
                  type="number"
                  min={0}
                  max={150}
                  value={handicapStr}
                  onChange={e => setHandicapStr(e.target.value)}
                  placeholder="Leave blank if none"
                />
              </Field.Root>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer gap={2}>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              colorPalette="blue"
              onClick={handleAdd}
              disabled={!name.trim()}
            >
              Add Archer
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

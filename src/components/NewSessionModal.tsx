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
import type { Session } from '../types';
import { ROUND_OPTIONS } from '../data/rounds';
import { createSession } from '../lib/storage';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (session: Session) => void;
}

export function NewSessionModal({ open, onClose, onCreated }: Props) {
  const [clubName, setClubName] = useState('');
  const [roundId, setRoundId] = useState(ROUND_OPTIONS[0].value);

  function handleCreate() {
    const trimmedClubName = clubName.trim();
    if (!trimmedClubName) return;
    const session: Session = {
      id: crypto.randomUUID(),
      clubName: trimmedClubName,
      date: new Date().toISOString().slice(0, 10),
      roundId,
      archers: [],
    };
    createSession(session);
    onCreated(session);
    setClubName('');
  }

  return (
    <Dialog.Root open={open} onOpenChange={e => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>New Session</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={4}>
              <Field.Root>
                <Input
                  value={clubName}
                  onChange={e => setClubName(e.target.value)}
                  placeholder="Club Name"
                />
              </Field.Root>
              <Field.Root>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={roundId}
                    onChange={e => setRoundId(e.target.value)}
                  >
                    {ROUND_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer gap={2}>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              colorPalette="blue"
              onClick={handleCreate}
              disabled={!clubName.trim()}
            >
              Create Session
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

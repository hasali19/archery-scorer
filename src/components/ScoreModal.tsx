import { CloseButton, Dialog } from '@chakra-ui/react';
import type { Archer, RoundDefinition } from '../types';
import { ScoreGrid } from './ScoreGrid';

interface Props {
  archer: Archer | null;
  round: RoundDefinition;
  onClose: () => void;
  onChange: (archerId: string, scores: (number | null)[]) => void;
}

export function ScoreModal({ archer, round, onClose, onChange }: Props) {
  return (
    <Dialog.Root
      open={archer !== null}
      onOpenChange={e => !e.open && onClose()}
      size="xl"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{archer?.name}</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Header>
          <Dialog.Body pb={6}>
            {archer && (
              <ScoreGrid
                round={round}
                scores={archer.scores}
                onChange={scores => onChange(archer.id, scores)}
              />
            )}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

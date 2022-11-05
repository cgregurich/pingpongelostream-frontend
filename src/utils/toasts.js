import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast({ position: 'bottom' });

let creating;
export function creatingGame() {
  creating = toast.info('Creating game...', { duration: 0, dismissible: false });
}

export function createGameFailed() {
  creating.dismiss();
  toast.error('Couldn\'t create game', { duration: 2000 });
}

export function gameCreated() {
  creating.dismiss();
  toast.success('Game created!', { duration: 3000 });
}
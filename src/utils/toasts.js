import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast({ position: 'bottom' });

let current;
export function creatingGame() {
  current = toast.info('Creating game...', { duration: 0, dismissible: false });
}

export function createGameFailed() {
  current.dismiss();
  toast.error('Couldn\'t create game', { duration: 2000 });
}

export function gameCreated() {
  current.dismiss();
  toast.success('Game created!', { duration: 3000 });
}

export function submittingSet() {
  current = toast.info('Submitting set...', { duration: 2000, dismissible: false });
}

export function setSubmitted() {
  current.dismiss();
  toast.success('Set submitted', { duration: 2000 });
}

export function submittingSetFailed() {
  current.dismiss();
  toast.error('Couldn\'t submit set', { duration: 2000 });
}

export function submittingGame() {
  current = toast.info('Submitting game...', { duration: 2000, dismissible: false });
}

export function gameSubmitted() {
  current.dismiss();
  toast.success('Game submitted', { duration: 2000 });
}

export function submittingGameFailed() {
  current.dismiss();
  toast.error('Couldn\'t submit game', { duration: 2000 });
}

export function gameNotFound(redirectCallback) {
  // Takes a callback function to call, 
  toast.error('Game not found. Redirecting to games page...');
  redirectCallback();
}

export function somethingWentWrong() {
  toast.error('Something went wrong...', { duration: 3000 });
}

export function loginSuccessful() {
  toast.success('Login successful', { duration: 2000 });
}

export function loginFailed() {
  toast.error('Login failed', { duration: 2000 });
}

export function registrationSuccessful() {
  toast.success('Registration successful.', { duration: 2000 });
}

export function registrationFailed() {
  toast.error('Registration failed', { duration: 2000 });
}

export function playerNotFound(redirectCallback) {
  toast.error('Player not found. Redirecting to dashboard...');
  redirectCallback();
}
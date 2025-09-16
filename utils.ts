export function setPasswordSecretly(input: HTMLInputElement, password: string) {
    if (input.getAttribute('type') !== 'password') {
        throw new Error('Input is not a password field!');
    }

    input.value = password;
}

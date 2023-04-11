declare module 'random-string-generator' {
  export type Type =
    | 'alphanumeric'
    | 'numeric'
    | 'upper'
    | 'lower'
    | 'uppernumeric'
    | 'lowernumeric'
    | `scoped`;

  export default function (length?: number, type?: Type | `scoped:${string}`): string;
}

type OverWrite<T, U> = Omit<T, keyof U> & U

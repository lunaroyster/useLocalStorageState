# React LocalStorage Layer

This package makes localStorage state available to your app. It maintains a shared context that syncs localStorage state updates

1. Wrap your app with `LocalStorageContextProvider`:

```tsx
function () {
    return (
        <LocalStorageContextProvider>
            <App />
        </LocalStorageContextProvider>
    )
}
```

2. Use `useLocalStorageState` to get or set localStorage state

```jsx
function Example() {
    const [n, setN] = useLocalStorageState('n', 0);

    return (
        <div>
            <button onClick={() => setN(n+1)}>{n}</button>
        </div>
    )
}
```

3. That's mostly it! Now you can use `useLocalStorageState` in any other component. It will stay in sync as you dispatch updates.
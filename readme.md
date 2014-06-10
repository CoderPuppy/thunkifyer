# Thunkifyer
**Convert stuff (arrays, objects and promises) to thunks**

## API
- `thunkifyer(val)` - Convert `val` to a thunk (works for arrays, objects and promises, otherwise throws an error)
- `thunkifyer.can(val)` - Returns whether `val` can be converted to a thunk
- `thunkifyer.is(val)` - Returns if `val` is a thunk
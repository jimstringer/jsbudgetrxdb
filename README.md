# JSBudget Client 
Personal Expense tracking web app using RxDb for local data storage. 
This will replace my current app that uses firestore so I don't have to worry about usage limits.

## Working
Backup/Restore from/to local file
Replicate to/from CouchDB 


## React + TypeScript + Vite for development enviroment

### Replication/Sync
- Requirements
1. run on mobile as webapp
2. replicate to laptop browser. When I open app in browser it should load latest data.

### Notes:
 Tried WebRTC. It requires a signaling server. I got a demo to work using rxdbs example signaling server. 
 Chrome browser had errors and didn't work. Firefox and safari and safari on my iphone all synced. 
 Changed to using:
 Couchdb running in Docker somewhat working. I see errors in console but sync seems to work.

 I may also try a Express server with sqlite for backup or replicate to firestore. 
 


## Expanded the ESLint configuration
### Tried this setting but it causes 271 errors. Most I don't know how to fix. 
      // Remove tseslint.configs.recommended and replace with this
     tseslint.configs.recommendedTypeChecked,

## Fixed all the errors!!! YEAH!!!
  Some were real errors and some just me not knowing typescript. 

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,

      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
### Did this and found and fixed 7 warnings
You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```



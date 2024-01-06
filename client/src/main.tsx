import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { store } from "./redux/store"
import { Provider } from "react-redux"
import { getCurrentUser } from './redux/actions/user.action.ts'

store.dispatch(getCurrentUser())

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)

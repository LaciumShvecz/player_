// src/main.tsx
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { NuqsAdapter } from 'nuqs/adapters/react-router'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	// Закомментируйте StrictMode
	// <React.StrictMode>
	<BrowserRouter>
		<NuqsAdapter>
			<App />
		</NuqsAdapter>
	</BrowserRouter>
	// </React.StrictMode>
)
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Dashboard } from '@/pages/dashboard'
import { Projects } from '@/pages/projects'
import { MockEditor } from '@/pages/mock-editor'
import { ApiDocs } from '@/pages/api-docs'
import { Settings } from '@/pages/settings'
import { Team } from '@/pages/team'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/mock-editor/:projectId?" element={<MockEditor />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/team" element={<Team />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App

import reactLogo from '../assets/react.svg'
import '../app/styles/index.css'

function App() {
  return (
    <>
      <section className="flex flex-col items-center">
        <div>
          <img src={reactLogo} className="framework" alt="React logo" />
        </div>
        <div>
          <h1 className="text-2xl underline">Get started</h1>
        </div>
      </section>
    </>
  )
}

export default App

export default function ProcessSteps({ steps }) {
  return (
    <ol className="process-steps">
      {steps.map(step => (
        <li className="process-step" key={step.n}>
          <span className="process-step-num">{step.n}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      ))}
    </ol>
  )
}

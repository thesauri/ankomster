import styles from "./App.css";

function App() {
  return (
    <div>
      <header>
        <h1>Ankomster</h1>
      </header>
      <table>
        <thead>
          <tr>
            <th>Tid</th>
            <th>Från</th>
            <th>Flygnr</th>
            <th>Anmärkning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>14:20</td>
            <td>Stockholm ARN</td>
            <td>SK34</td>
            <td>Landat</td>
          </tr>
          <tr>
            <td>17:25</td>
            <td>Stockholm ARN</td>
            <td>SK2030</td>
            <td></td>
          </tr>
          <tr>
            <td>20:30</td>
            <td>Stockholm BRA</td>
            <td>TF120</td>
            <td>Inställd</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;

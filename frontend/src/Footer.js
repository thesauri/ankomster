import "./Footer.css" 

const Footer = () => (
  <footer className="footer">
    <p>Fork me on <a href="https://github.com/thesauri/flyginfo">GitHub</a></p>
    <p>© {(new Date()).getFullYear()} <a href="https://berggren.dev">Walter Berggren</a></p>
  </footer>
)

export default Footer


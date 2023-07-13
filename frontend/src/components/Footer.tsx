import styles from "./Footer.module.css" 

export const Footer = () => (
    <footer className={styles.footer}>
        <p>Fork me on <a href="https://github.com/thesauri/flyginfo">GitHub</a></p>
        <p>© {(new Date()).getFullYear()} <a href="https://berggren.dev">Walter Berggren</a></p>
    </footer>
)

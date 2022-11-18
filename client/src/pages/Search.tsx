import { Searchbar } from '../features/Search/Searchbar';

export function Search() {
  return (
    <main
      style={{
        padding: '2.5rem 3.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <section style={{ width: '100%' }}>
        <Searchbar />
      </section>
    </main>
  );
}

import { useFetch } from "./useFetch";
import styles from "./person_card.module.css";

type PersonData = {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
};

const StatItem = ({ value }: { value: string }) => <p>{value}</p>;

const StatList = ({ values }: { values: string[] }) =>
  values.map((value, i) => <p key={i}>{value}</p>);

const Stat = ({ name, value }: { name: string; value: string | string[] }) => (
  <div className={styles.stat}>
    <div className={styles.name}>
      <p>
        {name}
        {":"}
      </p>
    </div>
    <div className={styles.value}>
      {value instanceof Array ? (
        <StatList values={value} />
      ) : (
        <StatItem value={value} />
      )}
    </div>
  </div>
);

function PersonCard({ id }: { id: number }) {
  const result = useFetch<PersonData>(`/people/${id}`);

  if (result.loading) {
    return <p>Loading...</p>;
  }

  if (result.error) {
    if (result.statusCode === 418) {
      return <p>418 I'm a tea pot, silly</p>;
    }
    if (result.statusCode === 500) {
      return <p>Oops... something went wrong, try again 🤕</p>;
    }
    return <p>Doh! Server says {result.error.message}</p>;
  }

  if (result.loaded) {
    return (
      <div className={styles.card}>
        {Object.entries(result.data).map(([key, value]) => (
          <Stat key={key} name={key} value={value} />
        ))}
      </div>
    );
  }

  return <p>Currently no data</p>;
}

export { PersonCard };

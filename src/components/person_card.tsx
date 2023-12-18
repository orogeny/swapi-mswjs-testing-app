import { useFetch } from "./useFetch";

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
  <div className="person-stat">
    <div className="person-stat__name">
      <p>
        {name}
        {":"}
      </p>
    </div>
    <div className="person-stat__value">
      {value instanceof Array ? (
        <StatList values={value} />
      ) : (
        <StatItem value={value} />
      )}
    </div>
  </div>
);

function PersonCard({ id }: { id: number }) {
  const { loading, loaded, data, statusCode, error } = useFetch<PersonData>(
    `/people/${id}`
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    if (statusCode === 418) {
      return <p>418 I'm a tea pot, silly</p>;
    }
    if (statusCode === 500) {
      return <p>Oops... something went wrong, try again 🤕</p>;
    }
    return <p>Doh! Server says {error.message}</p>;
  }

  if (loaded) {
    return (
      <>
        <div className="person-card">
          {Object.entries(data).map(([key, value]) => (
            <Stat key={key} name={key} value={value} />
          ))}
        </div>
      </>
    );
  }

  return <p>No data currently</p>;
}

export { PersonCard };

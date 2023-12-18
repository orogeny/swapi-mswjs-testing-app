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

function PersonCard() {
  const { loading, loaded, data } = useFetch<PersonData>("/people/1");

  if (loading) {
    return <p>Loading...</p>;
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

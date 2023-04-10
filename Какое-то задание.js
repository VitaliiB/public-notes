/* eslint-disable */


// Функция которая имитирует вычисления
// Ничего не делает, только висит ms миллисекунд, и всё
function expensiveComputationMs(ms) {
    var start = new Date().getTime(), expire = start + ms;
    while (new Date().getTime() < expire) { }
    return;
}

function filterList(list, filter) {
  expensiveComputationMs(100);

  return list.filter(l => l.name.includes(filter));
}

const TableHeader = React.memo(function({ headers }) {
  return headers.map((header) => (
    <><div key={header}>{header}</div></>
  ));
});

function Table({ list }) {
  const [filter, setFilter] = useState('');
  const [filteredList, setFilteredList] = useState(filterList(list, filter));

  const clearFilter = useCallback((event) => {
    if (event.key === "Escape") {
      setFilter('');
    }
  }, [setFilter]);

  useEffect(() => {
    setFilteredList(filterList(list, filter));

    document.addEventListener('keydown', clearFilter);
  }, [list, filter, clearFilter]);

  return (
    <>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <TableHeader headers={['ID', 'Название', 'Описание']} />
      {filteredList.map((element, index) => {
        const { id, name, description } = element;

        return (
          <div key={index}>
            <div>
              {id}
            </div>
            <div>
              <input value={name} onChange={(e) => element.name = e.target.value} />
            </div>
            <div>
              {description}
            </div>
          </div>
        );
      })}
    </>
  );
}

Table.propTypes = {
  list: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};
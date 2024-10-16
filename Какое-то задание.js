/* eslint-disable */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

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

const Title = React.memo(function({ children }) {
  return (
    <div>
      {children}
    </div>
  );
});

function Table({ list }) {
  let [filter, setFilter] = useState('');
  let [suggests, setSuggests] = useState([]);
  let [filteredList, setFilteredList] = useState(filterList(list, filter));

  let clearFilter = useCallback((event) => {
    if (event.key === "Escape") {
      setFilter('');
    }
  }, [setFilter]);

  useEffect(() => {
    setFilteredList(filterList(list, filter));

    fetch(`/suggests/${filter}`).then(async (response) => {
      if (response.ok) {
        setSuggests(await response.json());
      }
    });

    document.addEventListener('keydown', clearFilter);
  }, [list, filter, clearFilter]);

  return (
    <>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      {
        suggests.map((suggest) => (<div key={suggest} onClick={() => setFilter(suggest)}>{suggest}</div>))
      }
      <Title><span>Список элементов</span></Title>
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
              {description && description}
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
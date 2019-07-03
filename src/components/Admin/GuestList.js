import React from "react";
import { Table, Icon, Header } from "semantic-ui-react";
import firebase from "firebase/app";
import EditGuestModal from "./EditGuestModal";
import AddGuestModal from "./AddGuestModal";

const formatDate = date =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

const compareGuests = (...sortKeys) => (a, b) => {
  for (const key of sortKeys) {
    if (a[key] !== b[key]) {
      return a[key] > b[key] ? 1 : -1;
    }
  }
  return 1;
};

function RSVPInfoCell({ guest }) {
  if (guest.isAttending) {
    return (
      <Table.Cell positive>
        <Icon name="checkmark" />
        Yes
      </Table.Cell>
    );
  } else if (!guest.lastUpdated) {
    return (
      <Table.Cell warning>
        <Icon name="attention" />
        Not Responded
      </Table.Cell>
    );
  } else {
    return (
      <Table.Cell error>
        <Icon name="x" />
        No
      </Table.Cell>
    );
  }
}

export default function GuestList() {
  const [guests, setGuests] = React.useState([]);
  const [selectedGuest, setSelectedGuest] = React.useState(null);
  const [isAddModalOpen, setAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);

  const [column, setColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState(null);

  const handleSort = clickedColumn => () => {
    if (clickedColumn !== column) {
      setColumn(clickedColumn);
      setSortDirection("ascending");
      setGuests(prev => {
        const newGuestList = [...prev];
        const sortKeys =
          clickedColumn === "name"
            ? ["lastName", "firstName"]
            : [clickedColumn];
        newGuestList.sort(compareGuests(...sortKeys));
        return newGuestList;
      });
    } else {
      setGuests(prev => {
        const newGuestList = [...prev];
        newGuestList.reverse();
        return newGuestList;
      });
      setSortDirection(prevDirection =>
        prevDirection === "ascending" ? "descending" : "ascending"
      );
    }
  };

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedGuest(null);
  };

  const addGuest = newGuest => {
    setGuests(prev => [...prev, newGuest]);
  };

  const editGuest = guest => {
    setGuests(prev => {
      const guestIndex = prev.findIndex(g => g.id === guest.id);
      const newGuests = [...prev];
      newGuests[guestIndex] = guest;
      return newGuests;
    });
  };

  const deleteGuest = guest => {
    setGuests(prev => prev.filter(g => g.id !== guest.id));
  };

  React.useEffect(() => {
    const fetchGuestList = async () => {
      const querySnapshot = await firebase
        .firestore()
        .collection("guests")
        .orderBy("lastName", "asc")
        .get();

      setGuests(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchGuestList();
  }, []);

  const numAttending = guests.filter(guest => guest.isAttending).length;

  return (
    <>
      <AddGuestModal
        addGuest={addGuest}
        isOpen={isAddModalOpen}
        close={closeAddModal}
        open={openAddModal}
      />

      <EditGuestModal
        guest={selectedGuest}
        isOpen={isEditModalOpen}
        close={closeEditModal}
        editGuest={editGuest}
        deleteGuest={deleteGuest}
      />

      <Header as="h1">
        <Icon name="users" />
        <Header.Content>
          Guest List
          <Header.Subheader>{`${numAttending} / ${
            guests.length
          } RSVP'd`}</Header.Subheader>
        </Header.Content>
      </Header>
      <Table padded celled selectable sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === "name" ? sortDirection : null}
              onClick={handleSort("name")}
            >
              Name
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === "isAttending" ? sortDirection : null}
              onClick={handleSort("isAttending")}
            >
              Attending?
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === "mailingAddress" ? sortDirection : null}
              onClick={handleSort("mailingAddress")}
            >
              Mailing Address
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === "contactInfo" ? sortDirection : null}
              onClick={handleSort("contactInfo")}
            >
              Contact Info
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === "lastUpdated" ? sortDirection : null}
              onClick={handleSort("lastUpdated")}
            >
              Last Updated
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === "createdAt" ? sortDirection : null}
              onClick={handleSort("createdAt")}
            >
              Created At
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {guests.map(guest => (
            <Table.Row
              key={guest.id}
              onClick={() => {
                setSelectedGuest(guest);
                openEditModal();
              }}
            >
              <Table.Cell>{`${guest.firstName} ${guest.lastName}`}</Table.Cell>
              <RSVPInfoCell guest={guest} />
              <Table.Cell>{guest.mailingAddress}</Table.Cell>
              <Table.Cell>{guest.contactInfo}</Table.Cell>
              <Table.Cell>
                {guest.lastUpdated
                  ? formatDate(guest.lastUpdated.toDate())
                  : null}
              </Table.Cell>
              <Table.Cell>
                {guest.createdAt ? formatDate(guest.createdAt.toDate()) : null}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}

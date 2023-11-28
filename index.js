const express = require('express');

const app = express();
app.use(express.json());


const rooms = [
    { roomName: 'Conference Room A', seats: 20, amenities: ['Projector', 'Whiteboard'], pricePerHour: 50, id: 1 },
    { roomName: 'Meeting Room B', seats: 10, amenities: ['TV', 'Phone'], pricePerHour: 30, id: 2 },
  ];
const bookings = [{
      customerName: 'Karthick',
      date: '2023-11-28',
      startTime: '14:00',
      endTime: '16:00',
      roomId: 1,
      id: 1,
    },
    {
      customerName: 'Sridhar',
      date: '2023-11-29',
      startTime: '10:00',
      endTime: '12:00',
      roomId: 2,
      id: 2,
    }
]

//create a room
app.post('/createRoom', (req, res) => {
  const { roomName, seats, amenities, pricePerHour } = req.body;
  const room = { roomName, seats, amenities, pricePerHour, id: rooms.length + 1 };
  rooms.push(room);
  res.json(room);
});

//book a room
app.post('/bookRoom', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;

  // room available
  const existingBooking = bookings.find(
    (booking) =>
      booking.roomId === roomId &&
      booking.date === date &&
      ((startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime))
  );

  if (existingBooking) {
    return res.status(400).json({ error: 'Room already booked for the selected date and time' });
  }

  const booking = {
    customerName,
    date,
    startTime,
    endTime,
    roomId,
    id: bookings.length + 1,
  };
  bookings.push(booking);
  res.json(booking);
});

//all booked rooms
app.get('/listRooms', (req, res) => {
  const roomsWithBookings = rooms.map((room) => {
    const bookingsForRoom = bookings.filter((booking) => booking.roomId === room.id);
    return {
      roomName: room.roomName,
      bookedStatus: bookingsForRoom.length > 0,
      bookings: bookingsForRoom,
    };
  });
  res.json(roomsWithBookings);
});

// all booked customers
app.get('/listCustomers', (req, res) => {
  const customersWithBookings = bookings.map((booking) => {
    const room = rooms.find((r) => r.id === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: room.roomName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
  });
  res.json(customersWithBookings);
});

// specific customer
app.get('/customerBookingDetails/:customerName', (req, res) => {
  const customerName = req.params.customerName;
  const bookingsForCustomer = bookings.filter((booking) => booking.customerName === customerName);
  res.json(bookingsForCustomer);
});
//home
app.get('/',(req,res)=>res.send(home))

const PORT =  3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const home = `
    <h1>Welcome to Hall Booking API</h1>
    <br/>
    <p>GET - /listRooms  (Gets All Rooms list)</p>
    <p>GET - /listCustomers  (Get All customers list)</p>
    <p>GET - /customerBookingDetails/:customerName  (Get specific booked customer data)</p>
    <p>POST - /bookRoom  (Add New Room)</p>
    <p>POST - /createRoom (Add a new Room )</p>
    `    
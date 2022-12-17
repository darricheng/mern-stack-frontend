import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Col, Row, Typography, Form, Select, DatePicker, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { roomDescriptions } from "../assets/roomDescriptions";

// Necessary import inits
const { RangePicker } = DatePicker;
const { Option } = Select;

// TODO: use dayjs().toDate() to convert the date strings to date objects when calling the book room api

// Function to handle room search form submission failure.
const onFinishFailed = (errorInfo) => {
  console.error("Failed:", errorInfo);
};

// Function to book a room
const bookRoom = (room) => {
  console.log("Book room", room);
};

// Styles
const roomSearchFormStyle = {
  display: "flex",
  justifyContent: "start",
};

export default function RoomTypeDetails(props) {
  // Get the room search setting from App state
  // setRoomSearchSetting is for setting the single source of truth for the user's selected dates and room type
  const { roomSearchSetting, setRoomSearchSetting, handleDateChange } = props;

  // State to store the rooms returned from the api call
  const [rooms, setRooms] = useState([]);

  // Get the room type from the url instead of App state because the user may directly access the room type details page
  const { roomType } = useParams();

  // Replace the dash in roomType with a space, then capitalize the first letter of each word
  // e.g. single-room => Single Room
  const roomName = roomType
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  // Set the room type in App state to the room type in the url if the room type in the url is different from the room type in App state
  // Might happen if the user directly accesses the room type details page
  useEffect(() => {
    setRoomSearchSetting({
      ...roomSearchSetting,
      roomType: roomType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomType]); // Only want the effect to run when the room type changes

  // Get the rooms from the api when the room type changes
  useEffect(() => {
    // Function to get the available rooms from the api
    const getRoomsFromApi = async (roomType) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/rooms?room_type=${roomType}`
        );
        const rooms = await response.json();
        setRooms(rooms);
      } catch (error) {
        console.error(error);
      }
    };
    getRoomsFromApi(roomType);
  }, [roomType]);

  // Convert roomType to camelCase for importing the relevant room description
  // e.g. single-room => singleRoom
  const roomTypeCamelCase = roomType.replace(/-([a-z])/g, (g) =>
    g[1].toUpperCase()
  );

  return (
    <div style={{ padding: "48px" }}>
      {/* Check whether the room type is valid */}
      {rooms.length > 0 ? (
        <>
          <Row gutter={48}>
            <Col span={12}>
              <img
                // Import image depending on the room type
                src={require("../assets/" + roomType + ".jpg")}
                alt={roomName}
                style={{ width: "100%" }}
              />
            </Col>
            <Col span={12}>
              <Typography.Title level={1}>{roomName}</Typography.Title>
              <Typography.Paragraph>
                {roomDescriptions[roomTypeCamelCase]}
              </Typography.Paragraph>
              {rooms.every((room) => room.booked) ? (
                <p>No rooms available</p>
              ) : (
                <p>Rooms available</p>
              )}
              <Form
                layout="inline"
                style={roomSearchFormStyle}
                onFinish={bookRoom}
                onFinishFailed={onFinishFailed}
                initialValues={{
                  dateRange: [
                    roomSearchSetting.startDate,
                    roomSearchSetting.endDate,
                  ],
                  roomType: roomSearchSetting.roomType,
                }}
              >
                <Form.Item name="dateRange">
                  <RangePicker
                    size="large"
                    allowClear={false} // Disable the clear button
                    onChange={handleDateChange}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    size="large"
                    htmlType="submit"
                  >
                    Book a Room
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </>
      ) : (
        // If no rooms are returned from the api, then the room type is invalid
        <Typography.Title level={1}>No such room</Typography.Title>
      )}
    </div>
  );
}

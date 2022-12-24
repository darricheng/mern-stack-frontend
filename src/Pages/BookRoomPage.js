// Module imports
import { useContext, useState } from "react";
import { AuthContext } from "../firebase/AuthContext";
import { Form, Select, Typography, Input, Button } from "antd";

// Necessary component inits
const { Option } = Select;

// TODO: Function to call the api to book a room
const callBookRoomApi = async (bookingDetails) => {
  try {
    console.log(bookingDetails);
  } catch (error) {
    console.error(error);
  }
};

// Function to split special requests by commas into an array, then trims whitespace from both ends
const parseSpecialRequests = (data) => {
  // Split data by commas into an array
  const arr = data.split(",");
  // Remove whitespaces from the ends of each array element
  const noWhitespaceArr = arr.map((value) => value.trim());

  return noWhitespaceArr;
};

// Function that processes the booking submission
const processBookingSubmission = (values) => {
  // Get the form data from the values object
};

export default function BookRoomPage(props) {
  const { roomSearchSetting } = props;
  const { roomType, startDate, endDate } = roomSearchSetting;

  // Convert dash to space and capitalize the first letter of each word
  // e.g. single-room => Single Room
  const roomName = roomType
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  // Get the details of the logged in user
  const { user } = useContext(AuthContext);

  // Default state object for the booking details
  const defaultBookingDetails = {
    user: user,
    roomType: roomType,
    startDate: startDate,
    endDate: endDate,
    numGuests: 1,
    guestDetails: [
      {
        name: "",
        breakfast: "yes",
        lunch: "yes",
        dinner: "yes",
      },
    ],
  };
  // State to store the booking details entered by the user
  const [bookingDetails, setBookingDetails] = useState(defaultBookingDetails);

  const divStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return (
    <div style={divStyle}>
      <Typography.Title level={1}>Booking: {roomName}</Typography.Title>
      <Form>
        <Form.Item label="Number of Guests">
          <Select
            value={bookingDetails.numGuests}
            onChange={(value) =>
              setBookingDetails((prev) => {
                // Create a new array of guest details with the same length as the number of guests
                const newGuestDetails = Array(value)
                  .fill()
                  .map((_, index) => {
                    // If the new array is longer than the previous array, fill the new array with default guest details
                    if (index >= prev.guestDetails.length) {
                      return {
                        name: "",
                        breakfast: "yes",
                        lunch: "yes",
                        dinner: "yes",
                      };
                    }
                    // If the new array is shorter than the previous array, return the guest details from the previous array
                    else {
                      return prev.guestDetails[index];
                    }
                  });
                return {
                  ...prev,
                  numGuests: value,
                  guestDetails: newGuestDetails,
                };
              })
            }
          >
            <Option value={1}>1</Option>
            <Option value={2}>2</Option>
            <Option value={3}>3</Option>
            <Option value={4}>4</Option>
          </Select>
        </Form.Item>
        {/* Show number of guest details input fields based on numGuests */}
        {Array(bookingDetails.numGuests)
          .fill()
          .map((_, index) => (
            <>
              <Typography.Title level={3}>Guest {index + 1}</Typography.Title>
              <Form.Item label={`Name`}>
                <Input
                  onChange={(value) => {
                    setBookingDetails((prev) => {
                      const newGuestDetails = prev.guestDetails.map(
                        (guest, guestIndex) => {
                          if (guestIndex === index) {
                            return {
                              ...guest,
                              name: value.target.value,
                            };
                          } else {
                            return guest;
                          }
                        }
                      );
                      return {
                        ...prev,
                        guestDetails: newGuestDetails,
                      };
                    });
                  }}
                />
              </Form.Item>
              <Typography.Title level={4}>Meal Requirements</Typography.Title>
              <Form.Item label={"Breakfast"}>
                <Select
                  defaultValue={"yes"}
                  onChange={(value) => {
                    setBookingDetails((prev) => {
                      const newGuestDetails = prev.guestDetails.map(
                        (guest, guestIndex) => {
                          if (guestIndex === index) {
                            return {
                              ...guest,
                              breakfast: value,
                            };
                          } else {
                            return guest;
                          }
                        }
                      );
                      return {
                        ...prev,
                        guestDetails: newGuestDetails,
                      };
                    });
                  }}
                >
                  <Option value={"yes"}>Yes</Option>
                  <Option value={"no"}>No</Option>
                </Select>
              </Form.Item>
              <Form.Item label={"Lunch"}>
                <Select
                  defaultValue={"yes"}
                  onChange={(value) => {
                    setBookingDetails((prev) => {
                      const newGuestDetails = prev.guestDetails.map(
                        (guest, guestIndex) => {
                          if (guestIndex === index) {
                            return {
                              ...guest,
                              lunch: value,
                            };
                          } else {
                            return guest;
                          }
                        }
                      );
                      return {
                        ...prev,
                        guestDetails: newGuestDetails,
                      };
                    });
                  }}
                >
                  <Option value={"yes"}>Yes</Option>
                  <Option value={"no"}>No</Option>
                </Select>
              </Form.Item>
              <Form.Item label={"Dinner"}>
                <Select
                  defaultValue={"yes"}
                  onChange={(value) => {
                    setBookingDetails((prev) => {
                      const newGuestDetails = prev.guestDetails.map(
                        (guest, guestIndex) => {
                          if (guestIndex === index) {
                            return {
                              ...guest,
                              dinner: value,
                            };
                          } else {
                            return guest;
                          }
                        }
                      );
                      return {
                        ...prev,
                        guestDetails: newGuestDetails,
                      };
                    });
                  }}
                >
                  <Option value={"yes"}>Yes</Option>
                  <Option value={"no"}>No</Option>
                </Select>
              </Form.Item>
            </>
          ))}
        <Typography.Title level={3}>Other info</Typography.Title>
        <Form.Item label="Special Requests">
          <Input placeholder="e.g. extra pillows" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              console.log(bookingDetails);
            }}
          >
            Submit Booking
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

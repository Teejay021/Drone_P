import axios from "axios";

async function sendEmail(data) {
  try {

    console.log("Sending data:", data);
    const response = await axios.post("http://localhost:3002/send-email", data);
    console.log("Email sent successfully:", response.data);
    return response.data;

  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {

      // The server responded with a status code outside the 2xx range
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
      
    } else if (error.request) {

      // The request was made but no response was received
      console.error("Error request:", error.request);
    } else {

      // Something else caused the error
      console.error("Error message:", error.message);

    }
    return error;
  }
}

export default sendEmail;

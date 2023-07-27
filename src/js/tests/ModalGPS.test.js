// Import the ModalGPS class
import ModalGPS from "../ModalGPS";

// Create a test suite for the saveGPS method
describe("ModalGPS saveGPS() method tests", () => {
  let modalGPS;

  // Run before each test case
  beforeEach(() => {
    // Initialize the ModalGPS instance
    modalGPS = new ModalGPS();

    // Mock chat.textMsg function
    modalGPS.chat.textMsg = jest.fn();
  });

  // Test when input is empty
  test("Should do nothing when input is empty", () => {
    // Call the saveGPS method
    modalGPS.saveGPS();

    // Expect chat.textMsg not to be called
    expect(modalGPS.enderTextMsg).not.toHaveBeenCalled();
  });

  // Test when input matches the regex
  test("Should call chat.renderTextMsg and closeModal when input matches regex", () => {
    // Set the modal type
    modalGPS.type = "p";

    // Set the input value with valid GPS coordinates
    const validGPS = "12.34, 56.78";
    const input = document.createElement("input");
    input.className = "modal-input";
    input.value = validGPS;
    document.querySelector(".modal").appendChild(input);

    // Call the saveGPS method
    modalGPS.saveGPS();

    // Expect enderTextMsg to be called with the correct arguments
    expect(modalGPS.chat.textMsg).toHaveBeenCalledWith("p", validGPS, null);

    // Expect the input to be removed from the DOM
    expect(document.querySelector(".modal").childNodes.length).toBe(0);
  });

  // Test when input does not match the regex
  test("Should set input border to red when input does not match regex", () => {
    // Set the input value with invalid GPS coordinates
    const invalidGPS = "invalid";
    const input = document.createElement("input");
    input.className = "modal-input";
    input.value = invalidGPS;
    document.querySelector(".modal").appendChild(input);

    // Call the saveGPS method
    modalGPS.saveGPS();

    // Expect input border to be set to red
    expect(input.style.border).toBe("2px red solid");
  });
});

/* eslint-env node, jest */

import ModalGPS from "../ModalGPS";
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;

describe("checkValue()", () => {
  beforeEach(() => {
    // Create a virtual DOM environment using jsdom before each test
    document.body.innerHTML = `
      <div class="modal">
        <input class="modal-input" />
      </div>
    `;
  });

  test("should set red border and return when input is empty", () => {
    // Arrange
    const modalGPS = new ModalGPS();
    const input = document.querySelector(".modal-input");
    input.value = "";
    const saveGPSMock = jest.fn();
    modalGPS.saveGPS = saveGPSMock;

    // Act
    modalGPS.checkValue();

    // Assert
    expect(input.style.border).toBe("2px solid red");
    expect(saveGPSMock).not.toHaveBeenCalled();
  });

  test("should set red border and return when input has invalid value", () => {
    // Arrange
    const modalGPS = new ModalGPS();
    const input = document.querySelector(".modal-input");
    input.value = "invalidValue";
    const saveGPSMock = jest.fn();
    modalGPS.saveGPS = saveGPSMock;

    // Act
    modalGPS.checkValue();

    // Assert
    expect(input.style.border).toBe("2px solid red");
    expect(saveGPSMock).not.toHaveBeenCalled();
  });

  test("should add missing [ and ] when input is valid and saveGPS is called", () => {
    // Arrange
    const modalGPS = new ModalGPS();
    const input = document.querySelector(".modal-input");
    input.value = "12.345, 67.890";
    const saveGPSMock = jest.fn();
    modalGPS.saveGPS = saveGPSMock;

    // Act
    modalGPS.checkValue();

    // Assert
    expect(input.value).toBe("[12.345, 67.890]");
    expect(saveGPSMock).toHaveBeenCalledWith("[12.345, 67.890]");
  });
});

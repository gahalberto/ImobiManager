import request from "supertest";
import app from "../server";

describe("API Tests", () => {
  it("should return 200 for /ping", async () => {
    const response = await request(app as any).get("/ping");
    expect(response.status).toBe(200);
  });
});

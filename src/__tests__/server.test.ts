import request from "supertest";
import server from "../server"; // Seu servidor Express

describe("API Tests", () => {
  it("should return 200 for /ping", async () => {
    const response = await request(server as any).get("/ping");
    expect(response.status).toBe(200);
  });
});

//# Appel au controller
const {executeTransaction} = require("../transaction.controllers");

//# Appel aux services
const {findOrCreateUser} = require("../../service/user/user.service");
const {updateUserBalance} = require("../../service/user/balance.service");


const {findProduct,insertProducts} = require ("../../service/product/product.service");
const {decrementStock,updateAllStocks} = require ("../../service/product/stock.service");


const {createOrder} = require("../../service/order/order.service");
const {findOrCreateInvoice} = require("../../service/invoice/invoice.service");

//# mock des services
// Mock users et balance
jest.mock("../../service/user/user.service",()=>({
    findOrCreateUser : jest.fn(),

}))
jest.mock("../../service/user/balance.service",()=>({
    updateUserBalance : jest.fn(),

}))
// Mock product et stocke
jest.mock("../../service/product/product.service", () => ({
    findProduct: jest.fn(),
    insertProducts: jest.fn(),
}));
jest.mock("../../service/product/stock.service", () => ({
    decrementStock: jest.fn(),
    updateAllStocks: jest.fn(),
}));

// Mock order et invoice
jest.mock("../../service/order/order.service", () => ({
    createOrder: jest.fn(),
}));
jest.mock("../../service/invoice/invoice.service", () => ({
    findOrCreateInvoice: jest.fn(),
}));
// #Mock datas
const mockSession = {session: "Transaction session content type"};

const mockProduct = [
    {
        _id:"854f",
        name:"Doonut",
        price:2.5,
        stock:20,
    },
]

describe("Transaction Controller", () => {
    const mockSession = { session: "mockSession" };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should call all services with correct parameters", async () => {
        // Mock les services pour renvoyer des résultats simulés
        findOrCreateUser.mockResolvedValue([{ _id: "userId", name: "Test User" }]);
        findProduct.mockResolvedValue({ _id: "productId", stock: 10 });
        decrementStock.mockResolvedValue({ _id: "productId", stock: 9 });
        createOrder.mockResolvedValue({ _id: "orderId", amount: 100 });
        updateUserBalance.mockResolvedValue();
        findOrCreateInvoice.mockResolvedValue({ _id: "invoiceId" });

        // Exécution du contrôleur
        await executeTransaction("test@example.com", "Test User", "productId", mockSession);

        // Vérifie les appels aux services
        expect(findOrCreateUser).toHaveBeenCalledWith("test@example.com", "Test User", mockSession);
        expect(findProduct).toHaveBeenCalledWith("productId", mockSession);
        expect(decrementStock).toHaveBeenCalledWith(expect.any(Object), mockSession);
        expect(createOrder).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), mockSession);
        expect(updateUserBalance).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), mockSession);
        expect(findOrCreateInvoice).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), mockSession);
    });

    it("should stop execution if findOrCreateUser fails", async () => {
        findOrCreateUser.mockRejectedValue(new Error("User service failed"));

        await expect(
            executeTransaction("test@example.com", "Test User", "productId", mockSession)
        ).rejects.toThrow("User service failed");

        // Vérifie que les services suivants ne sont pas appelés
        expect(findProduct).not.toHaveBeenCalled();
        expect(decrementStock).not.toHaveBeenCalled();
    });
});
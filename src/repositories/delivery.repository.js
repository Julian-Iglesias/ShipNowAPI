import Delivery from "../models/delivery.model.js";

class DeliveryRepository {

    async createMany(deliveriesData) {
        return Delivery.insertMany(deliveriesData, {
            ordered: true
        });
    }

}

export default new DeliveryRepository();
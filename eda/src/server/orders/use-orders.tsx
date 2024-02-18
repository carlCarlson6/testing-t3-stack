import { useState } from "react";
import { Order } from "./order";
import { api } from "~/ui/api";
import { CreateOrderInput } from "./create-order";

export const useOrders = (initialOrders: Order[]) => {
    const [ orders, setOrders] = useState(initialOrders);
    const [ shouldFetch, setShouldFetch ] = useState(false);

    const { mutate, isLoading, } = api.orders.create.useMutation();
    const { data, isFetching, refetch } = api.orders.getAll.useQuery(undefined, { enabled: shouldFetch })
    if (!!data) {
        setOrders(data);
        setShouldFetch(false);
    }


    return {
        orders,
        addOrder: (items: CreateOrderInput["items"]) => mutate({items}, {
            onSuccess: _ => {
                setShouldFetch(true);
            }})
    };
}
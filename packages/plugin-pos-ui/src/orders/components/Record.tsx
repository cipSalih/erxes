import * as dayjs from "dayjs";
import _ from "lodash";
import Detail from "../containers/Detail";
import React from "react";
import { ModalTrigger } from "@erxes/ui/src";
import { FinanceAmount } from "../../styles";
import { IOrder } from "../types";

type Props = {
  order: IOrder;
  otherPayTitles: string[];
};

const Record = (props: Props) => {
  const { order } = props;

  const displayValue = (order, name) => {
    const value = _.get(order, name);
    return <FinanceAmount>{(value || 0).toLocaleString()}</FinanceAmount>;
  };

  const generateLabel = (customer) => {
    const { firstName, primaryEmail, primaryPhone, lastName } =
      customer || ({} as any);

    let value = firstName ? firstName.toUpperCase() : "";

    if (lastName) {
      value = `${value} ${lastName}`;
    }
    if (primaryPhone) {
      value = `${value} (${primaryPhone})`;
    }
    if (primaryEmail) {
      value = `${value} /${primaryEmail}/`;
    }

    return value;
  };

  const displayPaid = (order, key) => {
    const { paidAmounts } = order;
    const value = (
      (paidAmounts || []).filter((pa) => pa.title === key || pa.type === key) ||
      []
    ).reduce((sum, pa) => sum + pa.amount, 0);
    return (
      <FinanceAmount key={Math.random()}>
        {(value || 0).toLocaleString()}
      </FinanceAmount>
    );
  };

  const modalContent = (_props) => {
    return (
      <Detail orderId={order._id.split("_")[0]} posToken={order.posToken} />
    );
  };

  const trigger = (
    <tr>
      <td key={"Date"}>
        {dayjs(order.paidDate || order.createdAt).format("YYYY-MM-DD")}
      </td>
      <td key={"Time"}>
        {dayjs(order.paidDate || order.createdAt).format("HH:mm:ss")}
      </td>
      <td key={"BillID"}>{order.number} </td>
      <td key={"pos"}>
        {order.posName || ""}
        {order.origin === "kiosk" ? "*" : ""}
      </td>
      <td key={"branchId"}>
        {" "}
        {`${order.branch?.code || ""} - ${order.branch?.title || ""}` ||
          ""}{" "}
      </td>
      <td key={"departmentId"}>
        {" "}
        {`${order.department?.code || ""} - ${order.department?.title || ""}` ||
          ""}{" "}
      </td>
      <td key={"user"}>{order.user ? order.user.email : ""}</td>
      <td key={"type"}>{order.type || ""}</td>
      <td key={"billType"}>{order.billType || ""}</td>
      <td key={"registerNumber"}>{order.registerNumber || ""}</td>
      <td key={"customerType"}>{order.customerType || ""}</td>
      <td key={"customer"}>{generateLabel(order.customer) || ""}</td>
      <td key={"barcode"}>{order.items?.product?.barcodes?.[0] || ""}</td>
      <td key={"subBarcode"}>
        {(order.items?.manufactured &&
          dayjs(order.items?.manufactured).format("YYYY-MM-DD HH:mm")) ||
          ""}
      </td>
      <td key={"code"}>{order.items?.product?.code || ""}</td>
      <td key={"categoryCode"}>{order.items?.productCategory?.code || ""}</td>
      <td key={"categoryName"}>{order.items?.productCategory?.name || ""}</td>
      <td key={"name"}>{order.items?.product?.name || ""}</td>
      <td key={"count"}>{order.items?.count || 0}</td>
      <td key={"firstPrice"}>
        {((order.items?.count || 0) * (order.items?.unitPrice || 0) +
          (order.items?.discountAmount || 0)) /
          (order.items?.count || 1)}
      </td>
      <td key={"discountAmount"}>{order.items?.discountAmount || 0}</td>
      <td key={"discountType"}>{order.items?.discountType || ""}</td>
      <td key={"unitPrice"}>{order.items?.unitPrice || 0}</td>
      <td key={"amount"}>
        {(order.items?.count || 0) * (order.items?.unitPrice || 0)}
      </td>
      <td key={"amountType"}>
        {(order.status === "return" && "RETURNED") ||
          [
            ...Array.from(
              new Set(
                [
                  ...order.paidAmounts,
                  { type: "cash", amount: order.cashAmount },
                  { type: "mobile", amount: order.mobileAmount },
                ]
                  .filter((pa) => pa.amount > 0)
                  .map((pa) => pa.type)
              )
            ),
          ].join(", ")}
      </td>
      <td></td>
    </tr>
  );

  return (
    <ModalTrigger
      title={`Order detail`}
      trigger={trigger}
      autoOpenKey="showProductModal"
      content={modalContent}
      size={"lg"}
    />
  );
};

export default Record;

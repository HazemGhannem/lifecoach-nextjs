import * as React from "react";
import { Text, Section } from "@react-email/components";
import { BaseEmail } from "./BaseEmail";

interface OwnerBookingEmailProps {
  clientName: string;
  clientEmail: string;
  slotsText: string;
  packageName: string;
  price: number;
  nbScence: number;
}

export function OwnerBookingEmail({
  clientName,
  clientEmail,
  slotsText,
  packageName,
  price,
  nbScence,
}: OwnerBookingEmailProps) {
  return (
    <BaseEmail>
      <Text style={{ fontSize: "20px", fontWeight: "bold", color: "#B22222" }}>
        📢 Nouvelle réservation
      </Text>

      <Section style={{ marginTop: "15px" }}>
        <Text>
          <strong>Client :</strong> {clientName}
        </Text>
        <Text>
          <strong>Email :</strong> {clientEmail}
        </Text>

        <Text>
          <strong>Créneaux :</strong>
          <br />
          {slotsText.split("<br/>").map((slot, index) => (
            <React.Fragment key={index}>
              {slot}
              <br />
            </React.Fragment>
          ))}
        </Text>

        <Text>
          <strong>Forfait :</strong> {packageName}
        </Text>
        <Text>
          <strong>Nombre de séances :</strong> {nbScence}
        </Text>
        <Text>
          <strong>Prix :</strong> {price}€
        </Text>
      </Section>
    </BaseEmail>
  );
}

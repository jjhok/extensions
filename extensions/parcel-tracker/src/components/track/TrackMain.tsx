import { Action, ActionPanel, Icon, List } from "@raycast/api";
import React from "react";
import { logistics } from "../../metadata/logistics";
import Track from "./Track";

export default function TrackMain() {
  const vendors = logistics;

  return (
    <List searchBarPlaceholder="Choose delivery vendor">
      {vendors &&
        vendors.map((vendor) => (
          <List.Item
            key={vendor.code}
            icon={Icon.Circle}
            title={vendor.name}
            actions={
              <ActionPanel>
                <Action.Push title="Next" target={<Track vendorKey={vendor.code} vendorName={vendor.name} />} />
              </ActionPanel>
            }
          />
        ))}
    </List>
  );
}

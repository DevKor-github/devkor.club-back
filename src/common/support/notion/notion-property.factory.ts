import { Injectable } from "@nestjs/common";

@Injectable()
export class NotionPropertyFactory {
  createTextProperty(content: string) {
    return {
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: {
            content,
          },
        },
      ],
    };
  }

  createTitleProperty(content: string) {
    return {
      title: [
        {
          text: { content },
        },
      ],
    };
  }

  createNumberProperty(number: number) {
    return {
      number,
    };
  }

  createSelectProperty(name: string) {
    return {
      select: {
        name,
      },
    };
  }

  createMultiSelectProperty(names: string[]) {
    return {
      multi_select: names.map((name) => ({ name })),
    };
  }

  createCheckboxProperty(checked: boolean) {
    return {
      checkbox: checked,
    };
  }

  createDateProperty(start: string, end?: string) {
    return {
      date: {
        start,
        end,
      },
    };
  }

  createUrlProperty(url: string) {
    return {
      url,
    };
  }

  createEmailProperty(email: string) {
    return {
      email,
    };
  }

  createPhoneNumberProperty(phoneNumber: string) {
    return {
      phone_number: phoneNumber,
    };
  }
}

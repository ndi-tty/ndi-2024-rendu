import { AlertDialog, Button, Flex } from "@radix-ui/themes";

interface AlertProps {
  onCancel: () => void;
  onAction: () => void;
  title: string;
  description: string;
  actionText: string;
  cancelText: string;
}

const CustomAlertDialog: React.FC<AlertProps> = ({
  onCancel,
  onAction,
  title,
  description,
  actionText,
  cancelText,
}) => {
  return (
    <AlertDialog.Root defaultOpen={true}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {description}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" onClick={onCancel}>
              {cancelText}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={onAction}>
              {actionText}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default CustomAlertDialog;

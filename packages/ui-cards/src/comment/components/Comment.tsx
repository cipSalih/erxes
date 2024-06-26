import React from "react";
import Button from "@erxes/ui/src/components/Button";
import Icon from "@erxes/ui/src/components/Icon";
import { __, readFile, renderFullName } from "coreui/utils";
import {
  SpaceFormsWrapper,
  CommentWrapper,
  TicketComment,
  CreatedUser,
  CommentContent,
} from "@erxes/ui-settings/src/styles";
import { ColorButton } from "../../boards/styles/common";
import dayjs from "dayjs";
import { IUser } from "@erxes/ui/src/auth/types";
import { IClientPortalComment, ICommentCreatedUser } from "../types";
import Dialog from "@erxes/ui/src/components/Dialog";
import { ModalFooter } from "@erxes/ui/src/styles/main";

type Props = {
  currentUser: IUser;
  clientPortalComments: IClientPortalComment[];
  remove: (_id: string) => void;
};

type State = {
  show: boolean;
};

class Comment extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  render() {
    const { currentUser, clientPortalComments = [], remove } = this.props;

    const handleClose = () => this.setState({ show: false });
    const handleShow = () => this.setState({ show: true });

    return (
      <>
        <ColorButton onClick={() => handleShow()}>
          <Icon icon="comment-alt-message" />
          {__("Comment")}
        </ColorButton>

        <Dialog
          show={this.state.show}
          closeModal={() => handleClose()}
          title={__("Comments")}
        >
          <SpaceFormsWrapper>
            <CommentWrapper>
              {clientPortalComments.map((comment) => {
                const { createdUser = {} as ICommentCreatedUser } = comment;

                return (
                  <TicketComment key={comment._id}>
                    <CreatedUser>
                      <img
                        src={readFile(
                          createdUser && createdUser.avatar
                            ? createdUser.avatar
                            : "/images/avatar-colored.svg"
                        )}
                        alt="profile"
                      />
                      <div>
                        <CommentContent>
                          <h5>
                            {createdUser.fullName
                              ? createdUser.fullName
                              : renderFullName(createdUser)}
                          </h5>
                          <div
                            className="comment"
                            dangerouslySetInnerHTML={{
                              __html: comment.content,
                            }}
                          />
                        </CommentContent>
                        <span>
                          Created at{" "}
                          {dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
                        </span>
                      </div>
                      {createdUser?._id === currentUser._id && (
                        <div className="actions">
                          <span onClick={() => remove(comment._id)}>
                            Delete
                          </span>
                        </div>
                      )}
                    </CreatedUser>
                  </TicketComment>
                );
              })}
            </CommentWrapper>
          </SpaceFormsWrapper>
          <ModalFooter>
            <Button
              btnStyle="simple"
              size="small"
              icon="times-circle"
              onClick={() => handleClose()}
            >
              {__("Cancel")}
            </Button>
          </ModalFooter>
        </Dialog>
      </>
    );
  }
}

export default Comment;

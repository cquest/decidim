import { shallow } from "enzyme";
import * as React from "react";

import { UpVoteButton } from "./up_vote_button.component";
import VoteButton from "./vote_button.component";

import generateCommentsData from "../support/generate_comments_data";
import generateUserData from "../support/generate_user_data";

import { UpVoteButtonFragment } from "../support/schema";

describe("<UpVoteButton />", () => {
  const orderBy = "older";
  const rootCommentable = {
    id: "1",
    type: "Decidim::DummyResources::DummyResource"
  };
  let comment: UpVoteButtonFragment;
  let session: any = null;
  const upVote = jasmine.createSpy("upVote");

  beforeEach(() => {
    const commentsData = generateCommentsData(1);
    session = {
      user: generateUserData()
    };
    comment = commentsData[0];
  });

  it("should render a VoteButton component with the correct props", () => {
    const wrapper = shallow(<UpVoteButton session={session} comment={comment} upVote={upVote} rootCommentable={rootCommentable} orderBy={orderBy} />);
    expect(wrapper.find(VoteButton).prop("buttonClassName")).toEqual("comment__votes--up");
    expect(wrapper.find(VoteButton).prop("iconName")).toEqual("icon-chevron-top");
    expect(wrapper.find(VoteButton).prop("votes")).toEqual(comment.upVotes);
  });

  it("should pass disabled prop as false if comment upVoted is true", () => {
    comment.upVoted = true;
    const wrapper = shallow(<UpVoteButton session={session} comment={comment} upVote={upVote} rootCommentable={rootCommentable} orderBy={orderBy} />);
    expect(wrapper.find(VoteButton).prop("disabled")).toBeFalsy();
  });

  it("should pass disabled prop as false if comment downVoted is true", () => {
    comment.downVoted = true;
    const wrapper = shallow(<UpVoteButton session={session} comment={comment} upVote={upVote} rootCommentable={rootCommentable} orderBy={orderBy} />);
    expect(wrapper.find(VoteButton).prop("disabled")).toBeFalsy();
  });

  describe("when session is not present", () => {
    beforeEach(() => {
      session = null;
    });

    it("should pass userLoggedIn as false", () => {
      const wrapper = shallow(<UpVoteButton session={session} comment={comment} upVote={upVote} rootCommentable={rootCommentable} orderBy={orderBy} />);
      expect(wrapper.find(VoteButton).prop("userLoggedIn")).toBeFalsy();
    });
  });
});

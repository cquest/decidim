# frozen_string_literal: true

require "spec_helper"

describe Decidim::Surveys::Abilities::CurrentUserAbility do
  subject { described_class.new(user, context) }

  let(:organization) { build(:organization) }
  let(:user) { build(:user, organization: organization) }
  let(:participatory_process) { build(:participatory_process, organization: organization) }
  let(:surveys_feature) { build(:surveys_feature, participatory_space: participatory_process) }
  let(:context) do
    {
      current_feature: surveys_feature
    }
  end

  it { is_expected.to be_able_to(:answer, Decidim::Surveys::Survey) }
end

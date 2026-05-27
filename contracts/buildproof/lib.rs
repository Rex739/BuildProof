#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod buildproof {
    use ink::prelude::string::String;
    use ink::storage::Mapping;

    #[derive(Debug, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
    pub enum SubmissionStatus {
        Pending,
        Approved,
        Rejected,
    }

    #[derive(Debug, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
    pub struct Quest {
        pub id: u64,
        pub creator: AccountId,
        pub title: String,
        pub description: String,
        pub badge_name: String,
        pub active: bool,
    }

    #[derive(Debug, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
    pub struct Submission {
        pub id: u64,
        pub quest_id: u64,
        pub submitter: AccountId,
        pub proof_uri: String,
        pub status: SubmissionStatus,
    }

    #[derive(Debug, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
    pub struct Badge {
        pub id: u64,
        pub quest_id: u64,
        pub owner: AccountId,
        pub badge_name: String,
        pub proof_uri: String,
        pub issued_at: u64,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        QuestNotFound,
        QuestInactive,
        SubmissionNotFound,
        NotQuestCreator,
        SubmissionAlreadyReviewed,
        CounterOverflow,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    #[ink(storage)]
    pub struct BuildProof {
        quest_count: u64,
        submission_count: u64,
        badge_count: u64,
        quests: Mapping<u64, Quest>,
        submissions: Mapping<u64, Submission>,
        badges: Mapping<u64, Badge>,
        builder_badges: Mapping<(AccountId, u64), u64>,
        builder_badge_count: Mapping<AccountId, u64>,
    }

    impl Default for BuildProof {
        fn default() -> Self {
            Self::new()
        }
    }

    impl BuildProof {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                quest_count: 0,
                submission_count: 0,
                badge_count: 0,
                quests: Mapping::default(),
                submissions: Mapping::default(),
                badges: Mapping::default(),
                builder_badges: Mapping::default(),
                builder_badge_count: Mapping::default(),
            }
        }

        #[ink(message)]
        pub fn create_quest(
            &mut self,
            title: String,
            description: String,
            badge_name: String,
        ) -> Result<u64> {
            let id = self
                .quest_count
                .checked_add(1)
                .ok_or(Error::CounterOverflow)?;
            let quest = Quest {
                id,
                creator: self.env().caller(),
                title,
                description,
                badge_name,
                active: true,
            };

            self.quests.insert(id, &quest);
            self.quest_count = id;
            Ok(id)
        }

        #[ink(message)]
        pub fn submit_proof(&mut self, quest_id: u64, proof_uri: String) -> Result<u64> {
            let quest = self.quests.get(quest_id).ok_or(Error::QuestNotFound)?;
            if !quest.active {
                return Err(Error::QuestInactive);
            }

            let id = self
                .submission_count
                .checked_add(1)
                .ok_or(Error::CounterOverflow)?;
            let submission = Submission {
                id,
                quest_id,
                submitter: self.env().caller(),
                proof_uri,
                status: SubmissionStatus::Pending,
            };

            self.submissions.insert(id, &submission);
            self.submission_count = id;
            Ok(id)
        }

        #[ink(message)]
        pub fn review_submission(&mut self, submission_id: u64, approved: bool) -> Result<bool> {
            let mut submission = self
                .submissions
                .get(submission_id)
                .ok_or(Error::SubmissionNotFound)?;

            if submission.status != SubmissionStatus::Pending {
                return Err(Error::SubmissionAlreadyReviewed);
            }

            let quest = self
                .quests
                .get(submission.quest_id)
                .ok_or(Error::QuestNotFound)?;

            if quest.creator != self.env().caller() {
                return Err(Error::NotQuestCreator);
            }

            if approved {
                submission.status = SubmissionStatus::Approved;
                self.submissions.insert(submission_id, &submission);
                self.issue_badge(&quest, &submission)?;
            } else {
                submission.status = SubmissionStatus::Rejected;
                self.submissions.insert(submission_id, &submission);
            }

            Ok(true)
        }

        #[ink(message)]
        pub fn get_quest(&self, quest_id: u64) -> Option<Quest> {
            self.quests.get(quest_id)
        }

        #[ink(message)]
        pub fn get_submission(&self, submission_id: u64) -> Option<Submission> {
            self.submissions.get(submission_id)
        }

        #[ink(message)]
        pub fn get_badge(&self, badge_id: u64) -> Option<Badge> {
            self.badges.get(badge_id)
        }

        #[ink(message)]
        pub fn get_builder_badge_count(&self, builder: AccountId) -> u64 {
            self.builder_badge_count.get(builder).unwrap_or(0)
        }

        #[ink(message)]
        pub fn get_builder_badge(&self, builder: AccountId, index: u64) -> Option<Badge> {
            let badge_id = self.builder_badges.get((builder, index))?;
            self.get_badge(badge_id)
        }

        #[ink(message)]
        pub fn get_quest_count(&self) -> u64 {
            self.quest_count
        }

        #[ink(message)]
        pub fn get_submission_count(&self) -> u64 {
            self.submission_count
        }

        #[ink(message)]
        pub fn get_badge_count(&self) -> u64 {
            self.badge_count
        }

        fn issue_badge(&mut self, quest: &Quest, submission: &Submission) -> Result<()> {
            let badge_id = self
                .badge_count
                .checked_add(1)
                .ok_or(Error::CounterOverflow)?;
            let owner_badge_index = self
                .builder_badge_count
                .get(submission.submitter)
                .unwrap_or(0);
            let next_owner_badge_count = owner_badge_index
                .checked_add(1)
                .ok_or(Error::CounterOverflow)?;

            let badge = Badge {
                id: badge_id,
                quest_id: submission.quest_id,
                owner: submission.submitter,
                badge_name: quest.badge_name.clone(),
                proof_uri: submission.proof_uri.clone(),
                issued_at: self.env().block_timestamp(),
            };

            self.badges.insert(badge_id, &badge);
            self.builder_badges
                .insert((submission.submitter, owner_badge_index), &badge_id);
            self.builder_badge_count
                .insert(submission.submitter, &next_owner_badge_count);
            self.badge_count = badge_id;
            Ok(())
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink::env::test;

        fn accounts() -> test::DefaultAccounts<ink::env::DefaultEnvironment> {
            test::default_accounts::<ink::env::DefaultEnvironment>()
        }

        fn set_caller(caller: AccountId) {
            test::set_caller::<ink::env::DefaultEnvironment>(caller);
        }

        fn create_default_quest(contract: &mut BuildProof, creator: AccountId) -> u64 {
            set_caller(creator);
            contract.create_quest(
                String::from("Build a verified integration"),
                String::from("Submit a working demo with public proof."),
                String::from("Verified Integration Builder"),
            )
            .expect("quest should be created")
        }

        #[ink::test]
        fn creating_a_quest_works() {
            let accounts = accounts();
            let mut contract = BuildProof::new();

            let quest_id = create_default_quest(&mut contract, accounts.alice);
            let quest = contract.get_quest(quest_id).expect("quest should exist");

            assert_eq!(quest_id, 1);
            assert_eq!(contract.get_quest_count(), 1);
            assert_eq!(quest.creator, accounts.alice);
            assert_eq!(quest.badge_name, "Verified Integration Builder");
            assert!(quest.active);
        }

        #[ink::test]
        fn submitting_proof_works() {
            let accounts = accounts();
            let mut contract = BuildProof::new();
            let quest_id = create_default_quest(&mut contract, accounts.alice);

            set_caller(accounts.bob);
            let submission_id = contract
                .submit_proof(quest_id, String::from("ipfs://proof-1"))
                .expect("submission should succeed");
            let submission = contract
                .get_submission(submission_id)
                .expect("submission should exist");

            assert_eq!(submission_id, 1);
            assert_eq!(contract.get_submission_count(), 1);
            assert_eq!(submission.quest_id, quest_id);
            assert_eq!(submission.submitter, accounts.bob);
            assert_eq!(submission.status, SubmissionStatus::Pending);
        }

        #[ink::test]
        fn approving_proof_mints_badge() {
            let accounts = accounts();
            let mut contract = BuildProof::new();
            let quest_id = create_default_quest(&mut contract, accounts.alice);

            set_caller(accounts.bob);
            let submission_id = contract
                .submit_proof(quest_id, String::from("https://github.com/bob/proof"))
                .expect("submission should succeed");

            test::set_block_timestamp::<ink::env::DefaultEnvironment>(42);
            set_caller(accounts.alice);
            assert_eq!(contract.review_submission(submission_id, true), Ok(true));

            let submission = contract
                .get_submission(submission_id)
                .expect("submission should exist");
            let badge = contract.get_badge(1).expect("badge should exist");

            assert_eq!(submission.status, SubmissionStatus::Approved);
            assert_eq!(contract.get_badge_count(), 1);
            assert_eq!(badge.owner, accounts.bob);
            assert_eq!(badge.quest_id, quest_id);
            assert_eq!(badge.proof_uri, "https://github.com/bob/proof");
            assert_eq!(badge.issued_at, 42);
        }

        #[ink::test]
        fn rejecting_proof_does_not_mint_badge() {
            let accounts = accounts();
            let mut contract = BuildProof::new();
            let quest_id = create_default_quest(&mut contract, accounts.alice);

            set_caller(accounts.bob);
            let submission_id = contract
                .submit_proof(quest_id, String::from("ipfs://weak-proof"))
                .expect("submission should succeed");

            set_caller(accounts.alice);
            assert_eq!(contract.review_submission(submission_id, false), Ok(true));

            let submission = contract
                .get_submission(submission_id)
                .expect("submission should exist");
            assert_eq!(submission.status, SubmissionStatus::Rejected);
            assert_eq!(contract.get_badge_count(), 0);
            assert_eq!(contract.get_builder_badge_count(accounts.bob), 0);
        }

        #[ink::test]
        fn preventing_non_creator_review_works() {
            let accounts = accounts();
            let mut contract = BuildProof::new();
            let quest_id = create_default_quest(&mut contract, accounts.alice);

            set_caller(accounts.bob);
            let submission_id = contract
                .submit_proof(quest_id, String::from("ipfs://proof"))
                .expect("submission should succeed");

            set_caller(accounts.charlie);
            assert_eq!(
                contract.review_submission(submission_id, true),
                Err(Error::NotQuestCreator)
            );
            assert_eq!(contract.get_badge_count(), 0);
        }

        #[ink::test]
        fn reading_builder_badges_works() {
            let accounts = accounts();
            let mut contract = BuildProof::new();
            let quest_id = create_default_quest(&mut contract, accounts.alice);

            set_caller(accounts.bob);
            let submission_id = contract
                .submit_proof(quest_id, String::from("ipfs://proof"))
                .expect("submission should succeed");

            set_caller(accounts.alice);
            contract
                .review_submission(submission_id, true)
                .expect("review should succeed");

            assert_eq!(contract.get_builder_badge_count(accounts.bob), 1);
            let badge = contract
                .get_builder_badge(accounts.bob, 0)
                .expect("builder badge should exist");
            assert_eq!(badge.owner, accounts.bob);
            assert_eq!(badge.badge_name, "Verified Integration Builder");
            assert!(contract.get_builder_badge(accounts.bob, 1).is_none());
        }

        #[ink::test]
        fn preventing_double_review_works() {
            let accounts = accounts();
            let mut contract = BuildProof::new();
            let quest_id = create_default_quest(&mut contract, accounts.alice);

            set_caller(accounts.bob);
            let submission_id = contract
                .submit_proof(quest_id, String::from("ipfs://proof"))
                .expect("submission should succeed");

            set_caller(accounts.alice);
            assert_eq!(contract.review_submission(submission_id, true), Ok(true));
            assert_eq!(
                contract.review_submission(submission_id, false),
                Err(Error::SubmissionAlreadyReviewed)
            );
            assert_eq!(contract.get_badge_count(), 1);
        }
    }
}

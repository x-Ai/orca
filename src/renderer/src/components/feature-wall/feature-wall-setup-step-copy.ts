import { translate } from '@/i18n/i18n'
import type {
  FeatureWallSetupStep,
  FeatureWallSetupStepId
} from '../../../../shared/feature-wall-setup-steps'

const STEP_COPY: Record<FeatureWallSetupStepId, { name: () => string; description: () => string }> =
  {
    notifications: {
      name: () =>
        translate(
          'auto.components.feature.wall.setupSteps.notifications.name',
          'Turn on notifications'
        ),
      description: () =>
        translate(
          'auto.components.feature.wall.setupSteps.notifications.description',
          'Know the moment an agent finishes, needs attention, or gets blocked.'
        )
    },
    'default-agent': {
      name: () =>
        translate(
          'auto.components.feature.wall.setupSteps.defaultAgent.name',
          'Choose your default agent'
        ),
      description: () =>
        translate(
          'auto.components.feature.wall.setupSteps.defaultAgent.description',
          'Start new work faster with your preferred agent already selected.'
        )
    },
    'agent-capabilities': {
      name: () =>
        translate(
          'auto.components.feature.wall.setupSteps.agentCapabilities.name',
          'Enable Orca CLI'
        ),
      description: () =>
        translate(
          'auto.components.feature.wall.setupSteps.agentCapabilities.description',
          'Register the Orca shell command and install agent skills for browser, computer, and orchestration workflows.'
        )
    },
    'task-sources': {
      name: () =>
        translate(
          'auto.components.feature.wall.setupSteps.taskSources.name',
          'Connect integrations'
        ),
      description: () =>
        translate(
          'auto.components.feature.wall.setupSteps.taskSources.description',
          'Start an agent from a task in one click and keep PR status in view.'
        )
    },
    'setup-script': {
      name: () =>
        translate(
          'auto.components.feature.wall.setupSteps.setupScript.name',
          'Automate workspace setup'
        ),
      description: () =>
        translate(
          'auto.components.feature.wall.setupSteps.setupScript.description',
          'Run install and setup commands automatically so every new worktree is ready for agents.'
        )
    },
    'add-two-repos': {
      name: () =>
        translate(
          'auto.components.feature.wall.setupSteps.addTwoRepos.name',
          'Start work in multiple repos'
        ),
      description: () =>
        translate(
          'auto.components.feature.wall.setupSteps.addTwoRepos.description',
          'Bring your key repos into Orca so you can start agent work without hunting for folders.'
        )
    },
    'two-worktrees': {
      name: () =>
        translate('auto.components.feature.wall.setupSteps.twoWorktrees.name', 'Multi-task'),
      description: () =>
        translate(
          'auto.components.feature.wall.setupSteps.twoWorktrees.description',
          'Work in 2 different worktrees at once. Each one is isolated (even in the same project). Perfect for working on 2 features at once.'
        )
    },
    browser: {
      name: () =>
        translate('auto.components.feature.wall.setupSteps.browser.name', "Use Orca's browser"),
      description: () =>
        translate(
          'auto.components.feature.wall.setupSteps.browser.description',
          'Browse your web app without leaving Orca. Grab any element and send its exact source and styles to an agent with one click.'
        )
    }
  }

export function localizeFeatureWallSetupStep(step: FeatureWallSetupStep): FeatureWallSetupStep {
  const copy = STEP_COPY[step.id]
  if (!copy) {
    return step
  }
  const name = copy.name()
  return {
    ...step,
    name,
    subtitle: name,
    description: copy.description()
  }
}
